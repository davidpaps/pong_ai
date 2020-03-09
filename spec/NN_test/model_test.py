import os
NN = os.system("python3 ../../pygym/RMSprop/NN.py")
from NN import forward_prop


def test_print():
  print('hello')

# def test_make_move(A3):
#   if A3 > 0.975:
#     action = 2 
#   elif A3 < 0.025:
#     action = 3
#   elif A3 > np.random.uniform():
#     action = 2
#   else:
#     action = 3 
#   return action 

if __name__ == "__main__":
  test_print()
  # test_make_move()
  print("Everything passed")
