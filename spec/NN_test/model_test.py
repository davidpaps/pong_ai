import os
NN = os.system("python3 ../../pygym/RMSprop/NN.py")
from NN import forward_prop


def test_print():
  print('hello')

# def test_convnet():
#       image = tf.placeholder(tf.float32, (None, 100, 100, 3)
#   model = Model(image)
#   sess = tf.Session()
#   sess.run(tf.global_variables_initializer())
#   before = sess.run(tf.trainable_variables())
#   _ = sess.run(model.train, feed_dict={
#                image: np.ones((1, 100, 100, 3)),
#                })
#   after = sess.run(tf.trainable_variables())
#   for b, a, n in zip(before, after):
#       # Make sure something changed.
#       assert (b != a).any()
# this test will verify that the variables that we created get trained.
# grabbed this from my reading of doc i linked in slack 
# its commented out as it currently refers to tensor flow and other thing not in our net


if __name__ == "__main__":
  test_print()
  # test_make_move()
  print("Everything passed")
