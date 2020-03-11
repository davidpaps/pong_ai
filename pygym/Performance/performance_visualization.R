# Data visualization 

data <- read.csv("performance_file.csv")
RMS <- read.csv("RMSperformance.csv")

# If do not have below library run uncomment below line and run
# install.packages("pracma")
library(pracma)

index <- seq(1,12941,1)
loss2 <- as.vector(RMS[[3]])
av <- movavg(loss2, 30)
av100 <- movavg(loss2, 100)

RMSloss <- as.vector(RMS[[3]])
av <- movavg(RMSloss, 30)
av100 <- movavg(RMSloss, 100)

plot(av, type="l",col=rgb(red=0.4, green=0.5, blue=1.0, alpha=0.4))
lines(av100, type="l", col=rgb(red=1.0, green=0.0, blue=0.0, alpha=0.6))
lines(loss2, col = alpha(0.4))
grid(nx = loss2, ny = NULL, col = "lightgray")
grid(nx = NULL, ny = nx, col = "lightgray")

plot(av, type="l",col=rgb(red=0.4, green=0.5, blue=1.0, alpha=0.4))
lines(av100, type="l", col=rgb(red=1.0, green=0.0, blue=0.0, alpha=0.6))
lines(loss2, col = alpha(0.4))
grid(nx = loss2, ny = NULL, col = "lightgray")
grid(nx = NULL, ny = nx, col = "lightgray")

