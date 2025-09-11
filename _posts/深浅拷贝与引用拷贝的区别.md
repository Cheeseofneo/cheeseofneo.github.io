---
title: 深浅拷贝与引用拷贝的区别
date: 2024-01-13
tags:
---

# 深浅拷贝与引用拷贝的区别

拷贝可以分为引用拷贝和对象拷贝。

## 引用拷贝

引用拷贝不会在堆上创建一个新的对象，只会在栈上生成一个新的引用地址，最终指向依然是堆上的同一个对象。

举个例子，假设有如下对象：

```C++
//实体类
class Person{ 
public:
    
    Person(string name1, int height1, string something1) {
        name = name1;
        height = height1;
        something = something1;
    }
    string getName() {return name;}

    void setName(string setname) {name = setname;}

    int getHeight() {return height;}

    void setHeight(int setheight) {height = setheight;}

    string getSomething() {return something;}

    void setSomething(string setsomething) {something = setsomething;}

private: 
    string name;//姓名
    int height;//身高
    string something;
};

```

```C++
Person p1 = Person("小张", 180, "今天天气很好");
Person& p2 = p1;

cout<<"对象是否相等："<<endl;
cout<<( "p1 属性值=" + p1.getName()+ "," + to_string(p1.getHeight()) + "," + p1.getSomething())<<endl;
cout<<( "p2 属性值=" + p2.getName()+ "," + to_string(p2.getHeight()) + "," + p2.getSomething())<<endl;

p1.setName("小王"); 
p1.setHeight(200);
p1.setSomething(p1.getSomething().append(",适合出去玩"));
cout<<"...after p1 change...."<<endl;
cout<<( "p1 属性值=" + p1.getName()+ "," + to_string(p1.getHeight()) + ","+ p1.getSomething())<<endl;
cout<<( "p2 属性值=" + p2.getName()+ "," + to_string(p2.getHeight()) + ","+ p2.getSomething())<<endl;
```

在C++中，存在方便的引用拷贝，就是引用符号&对对象进行引用
程序输出结果为
>   p1 属性值=小张,180,今天天气很好
    p2 属性值=小张,180,今天天气很好
    ...after p1 change....
    p1 属性值=小王,200,今天天气很好,适合出去玩
    p2 属性值=小王,200,今天天气很好,适合出去玩

{% asset_img s1.png %}

由于2个引用p1,p2 都是指向堆中同一个对象，所以2个对象是相等的，修改了对象p1，会影响到对象p2

## 浅拷贝

浅拷贝 ：浅拷贝会在堆上创建一个新的对象，新对象和原对象不等，但是新对象的属性和老对象相同。

浅拷贝就是逐个字节的拷贝。也就是说，拷贝后每一个成员变量的值都相同。如果该值是基本数据类型，那么该值被拷贝；如果该值是引用数据类型（如对象、指针等），那么该值（注意：这里的值是指地址）也会被拷贝。

```C++
Person p1 = Person("小张", 180, "今天天气很好");
Person p2 = p1;

cout<<"对象是否相等："<<endl;
cout<<( "p1 属性值=" + p1.getName()+ "," + to_string(p1.getHeight()) + "," + p1.getSomething())<<endl;
cout<<( "p2 属性值=" + p2.getName()+ "," + to_string(p2.getHeight()) + "," + p2.getSomething())<<endl;

// change
p1.setName("小王"); 
p1.setHeight(200);
p1.setSomething(p1.getSomething().append(",适合出去玩"));
cout<<"...after p1 change...."<<endl;
cout<<( "p1 属性值=" + p1.getName()+ "," + to_string(p1.getHeight()) + ","+ p1.getSomething())<<endl;
cout<<( "p2 属性值=" + p2.getName()+ "," + to_string(p2.getHeight()) + ","+ p2.getSomething())<<endl;
```

程序输出为
>   p1 属性值=小张,180,今天天气很好
    p2 属性值=小张,180,今天天气很好
    ...after p1 change....
    p1 属性值=小王,200,今天天气很好,适合出去玩
    p2 属性值=小张,180,今天天气很好

我们可以看出:两个对象基本数据类型的成员变量是相互独立的，不会相互影响。因为在 C++ 中，默认对象之间的拷贝（包括默认复制构造函数和默认赋值语句）是浅拷贝。

{% asset_img s2.png %}

- 如果属性是基本类型(int,double,long,boolean等)，拷贝的就是基本类型的值。
- 如果属性是引用类型(除了基本类型都是引用类型)，拷贝的就是引⽤数据类型变量的地址值，⽽对于引⽤类型变量指向的堆中的对象不会拷贝。
- name属性，虽然是引用类型，但同时也是String类型，对其修改，会默认在堆上创建新的内存空间，再重新赋值
- int weight=180; 是成员变量，存放在堆中，不是所有的基本类型变量都存放在栈中

测试结果：
char* 不可以
int[5] 不可以

int* 可以实现

## 深拷贝

深拷贝 ：完全拷贝⼀个对象，在堆上创建一个新的对象，拷贝被拷贝对象的成员变量的值，同时堆中的对象也会拷贝。

在C++中，自定义复制构造函数、重载赋值运算符来实现深拷贝。

```C++
class DeepCopyObject
    {
    public:
        int basicType;
        int *refType;

        DeepCopyObject()
        {
            basicType = 10;
            refType = new int[10];
            for (int i = 0; i < 10; i++)
            {
                refType[i] = i;
            }
        }

        DeepCopyObject(const DeepCopyObject &obj)
        {
            basicType = obj.basicType;
            refType = new int[10];
            for (int i = 0; i < 10; i++)
            {
                refType[i] = obj.refType[i];
            }
        }

        ~DeepCopyObject()
        {
            if (refType)
                delete[] refType;
        }

        DeepCopyObject &operator=(const DeepCopyObject &obj)
        {
            basicType = obj.basicType;
            if (this == &obj) // obj = obj; 情况
                return *this;
            delete[] refType;
            refType = new int[10];
            for (int i = 0; i < 10; i++)
            {
                refType[i] = obj.refType[i];
            }

            return *this;
        }
    };

```

本文结束。