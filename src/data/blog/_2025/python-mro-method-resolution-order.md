---
title: Understanding Python's __mro__ - Method Resolution Order
slug: python-mro-method-resolution-order
draft: false
pubDatetime: 2025-08-11T10:00:00.000Z
description: Python's __mro__ determines the order in which methods are searched in inheritance hierarchies. Learn what it is, why it matters, and see practical examples.
tags:
  - Python
  - OOP
---

Python's `__mro__` (Method Resolution Order) is a crucial concept that determines how Python looks up methods in inheritance hierarchies. Let's dive into what it is, why we need it, and see it in action.

## 🔍 What is __mro__?

`__mro__` is a tuple that defines the order in which Python searches for methods and attributes in a class hierarchy. Every class has this attribute, showing its linearized inheritance path.

```python
class Animal:
    pass

class Dog(Animal):
    pass

print(Dog.__mro__)
# (<class '__main__.Dog'>, <class '__main__.Animal'>, <class 'object'>)
```

Python searches from left to right: first in `Dog`, then `Animal`, finally `object`.

---

## 🎯 Why Do We Need It?

The MRO solves the **diamond problem** in multiple inheritance - when a class inherits from multiple classes that share a common ancestor.

```python
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):  # Diamond inheritance
    pass

d = D()
print(d.method())  # "B" - follows MRO
print(D.__mro__)
# (<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)
```

Without MRO, Python wouldn't know whether to call `B.method()` or `C.method()`. The MRO provides a consistent, predictable order using the **C3 linearization algorithm**.

---

## 💡 Practical Use Cases

### 1. Super() in Cooperative Inheritance

`super()` follows the MRO, not just the parent class. This enables cooperative multiple inheritance:

```python
class Logger:
    def save(self):
        print("Logging...")
        super().save()  # Continues MRO chain

class Database:
    def save(self):
        print("Saving to database...")

class Model(Logger, Database):
    def save(self):
        print("Validating...")
        super().save()  # Calls Logger.save()

model = Model()
model.save()
# Output:
# Validating...
# Logging...
# Saving to database...
```

### 2. Mixin Classes

MRO makes mixins powerful by ensuring methods are called in the right order:

```python
class TimestampMixin:
    def save(self):
        self.updated_at = "2025-08-11"
        super().save()

class ValidationMixin:
    def save(self):
        if not hasattr(self, 'name'):
            raise ValueError("Name required")
        super().save()

class BaseModel:
    def save(self):
        print(f"Saving {self.name} at {self.updated_at}")

class User(ValidationMixin, TimestampMixin, BaseModel):
    def __init__(self, name):
        self.name = name

user = User("Alice")
user.save()  # Validates, adds timestamp, then saves
# Output: Saving Alice at 2025-08-11
```

### 3. Framework Method Overriding

Web frameworks like Django use MRO to let you override specific behaviors while keeping others:

```python
class BaseView:
    def get(self):
        return self.render()
    
    def render(self):
        return "Base rendering"

class AuthMixin:
    def get(self):
        if not self.is_authenticated():
            return "Login required"
        return super().get()
    
    def is_authenticated(self):
        return False

class MyView(AuthMixin, BaseView):
    def render(self):
        return "Custom rendering"

view = MyView()
print(view.get())  # "Login required" - AuthMixin.get() runs first
print(MyView.__mro__)
# Shows: MyView -> AuthMixin -> BaseView -> object
```

---

## 🚀 Key Takeaways

- `__mro__` defines the method lookup order in inheritance hierarchies
- It solves the diamond problem using C3 linearization
- Order matters in multiple inheritance: `class Child(Parent1, Parent2)` searches Parent1 before Parent2
- `super()` follows the MRO, not just the immediate parent
- Understanding MRO is essential for designing effective mixin classes and using frameworks

Remember: when in doubt, check `YourClass.__mro__` to see the exact lookup order!