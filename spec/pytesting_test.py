def test_sum():
    assert sum([5, 6, 5]) == 16, "Should be 16"

def test_set_comparison():
    set1 = set("8035")
    set2 = set("8035")
    assert set1 == set2

if __name__ == "__main__":
    test_sum()
    test_set_comparison()
    print("All tests ran")
