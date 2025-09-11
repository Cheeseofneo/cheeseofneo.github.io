---
title: “Mingw+VSCode使用matplotlibcpp库”
date: 2024-01-02 
permalink: /posts/2025/09/post2/
---
### 背景
在C++中常需要处理数据并进行可视化，而标准库中并没有提供绘图的工具，因此需要借助外部库来完成。目前来看Matplotlibcpp实现较为容易，因为是调用python库的API来完成的。本文讲述使用Vscode+MIngw的C++开发环境下如何使用Matplotlib库。

### 实现

**1. Vscode和Mingw的安装**
参考其他博客

**2. 配置完C++的开发环境后，安装Vcpkg：**

vcpkg是一个开源的多系统兼容的C/C++库管理工具，一般作为cmake的子模块使用
使用以下命令安装您的项目所需要的库：

> .\vcpkg\vcpkg install [packages to install]

请注意: vcpkg 在 Windows 中默认编译并安装 x86 版本的库。 若要编译并安装 x64 版本，请执行:

> .\vcpkg\vcpkg install [package name]:x64-windows

或

> .\vcpkg\vcpkg install [packages to install] --triplet=x64-windows

您也可以使用 search 子命令来查找 vcpkg 中集成的库:

> .\vcpkg\vcpkg search [search term]

在此之后，您可以创建一个非 CMake 项目 (或打开已有的项目)。 在您的项目中，所有已安装的库均可立即使用 #include 包含您需使用的库的头文件且无需额外配置。

#### 在Visual Studio Code 中使用 vcpkg
将以下内容添加到您的工作区的 settings.json 中将使 CMake Tools 自动使用 vcpkg 中的第三方库:

```json
{
  "cmake.configureSettings": {
    "CMAKE_TOOLCHAIN_FILE": "[vcpkg root]/scripts/buildsystems/vcpkg.cmake"
  }
}
```

如果不使用Cmake，需要将vcpkg链接至vscode：

1. 在c_cpp_properties.json中的“includePath”中添加
> "${vcpkgRoot}/x64-windows/include"
2. 在task.json中的“args”最后添加vcpkg的include路径
> "-I"
"E:/vcpkg/installed/x64-windows/include"

**3. python环境的搭建**

由于matplotlibcpp是间接引用matplotlib的python库，因此需要安装python环境。
可以是独立的python环境或anaconda下的虚拟环境或默认环境，最好是python3。
可以使用 which python 指令来检查系统的python环境。
python环境搭建完成后：

- 在c_cpp_properties.json文件中，添加python及numpy的include路径
  > \$PYTHONHOME/include    \\
  > \$PYTHONHOME/lib/site-packages/numpy/core/include 
- 在task.json文件中，添加python及numpy的include路径
  > -I 
  > \$PYTHONHOME/include    
  > -I
  > \$PYTHONHOME/lib/site-packages/numpy/core/include 
  > -L
  > \$PYTHONHOME
  > -l
  > python3x

**4. 使用mingw编译matplotlibcpp：**

在笔者使用matplotlibcpp的过程中，其他博客中的常见错误并没有发生，反而出现
> "undefined reference to `std::ios_base::Init::Init()"

解决方案：使用g++编译
> g++ = gcc -xc++ -lstdc++ -shared-libgcc

然后出现了核心错误：
> Fatal Python error: Py_Initialize: unable to load the file system codec
LookupError: no codec search functions registered: can't find encoding

这个问题困扰了我很久，后来发现在debug的过程中，PYTHONHOME一直为mingw下的python2.7的路径，以下三种修改环境变量都无法改变。

1. 在settings.json中修改PYTHONPATH
   > "terminal.integrated.env.windows": { "PYTHONPATH": "xxx/site-packages" }
  
2. 在项目工作区创建一个.env文件, 并加入以下设置：
   > PYTHONPATH=xxx/site-packages

3. 在“编辑系统环境变量”中设置

考虑此错误出现的原因是mingw10在编译时需要debug，而debug会自动调用python2.7来生成调试信息，导致无法使用python3。但是通过在main函数执行的开始添加以下语句，创建了一个python的虚拟机，解决了该问题。
> Py_SetPythonHome(L"D:\\python39");
  Py_Initialize();  

### 扩展

在C++中调用python脚本:

```C++
    Py_SetPythonHome(L"D:\\python39");
    //初始化python解释器，告诉编译器要用的python编译器
    Py_Initialize();                          
    //调用python文件
    PyRun_SimpleString("import test");     
    //调用上述文件中的函数  
    PyRun_SimpleString("print('hello')"); 
    //结束python解释器，释放资源
    Py_Finalize();                      
    system("Pause");
    return 0; 
```
