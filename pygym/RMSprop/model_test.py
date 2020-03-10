import pytest
import sys
import NN

def test_print():
  print('hello')

# def seam_test():
# print('needs to be between 0 and 1')
#   @weights = NeuralNetwork.weights,
#   @weights.each do |point|
#     (0..1).must_include(point)

# it 'has data that sums up to 1'
#   @weights = NeuralNetwork.weights,
  
#   @weights.reduce(&:+).must_equal 1

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

# Where is the batting data sent / physically stored url? gym? one side is the gym?
# whats the format for the episode I cant find this in the implementation, confirming that this is a game
# Where in the code is this sent cause if i did see it i did not recognise it - also where did we configure gym 
# how can i view / show current model when i start a series of episodes 
# 
# 

if __name__ == "__main__":
  test_print()
  # test_make_move()
  print("Everything passed")
