import os.path 
from pathlib import Path

def test_files():
    if os.path.isfile('../Net-Positive-Makers/net_positive/pong/urls.py'):
        print ('File exists')
    else:
        assert(print('File not existent'))

def test_path():
    if Path('../Net-Positive-Makers/net_positive/pong/urls.py').is_file():
        print ("File exist2")
    else:
        assert(print("File not exist2"))
# checking various import methods for my sanity sake,
#  so I can require the file

if __name__ == "__main__":
    test_files()
    test_path()
    print("All tests ran")
