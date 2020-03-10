import pytest 

def test_sum():
    assert sum([5, 6, 5]) == 16, "Should be 16"

def test_set_comparison():
    set1 = set("8035")
    set2 = set("8035")
    assert set1 == set2

def func(x):
    return x + 1

def test_func():
    assert func(4) == 5

def f():
    raise SystemExit(1)

def test_f():
    with pytest.raises(SystemExit):
      f()

class TestClass:
      def test_one(self):
          x = 'This'
          assert 'h' in x
      def test_two(self):
          x = 'hello'
          assert 'h' in x, 'check'


if __name__ == "__main__":
    test_sum()
    test_set_comparison()
    test_f()
    test_func()
    TestClass
    print("All tests ran")

