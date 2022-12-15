#Three lines to make our compiler able to draw:
import sys
import matplotlib

import matplotlib.pyplot as plt
import numpy as np

x = []
i = 0.05

while round(i, 2) <= 1:
    x.append(round(i, 2))
    i += 0.05
ypoints1 = np.array([434, 528, 383, 423, 448, 491, 449, 493, 588, 631, 679, 726, 786, 790, 879, 905, 994, 976, 1039, 1183])
ypoints2 = np.array([302, 365, 426, 386, 455, 520, 590, 490, 550, 663, 727, 734, 769, 845, 902, 914, 961, 987, 1070, 1115])
ypoints3 = np.array([394, 468, 430, 420, 429, 433, 565, 495, 551, 644, 729, 761, 761, 868, 884, 926, 1003, 1052, 1091, 1176])
xpoints = np.array(x)
ypoints = []

for i in range(len(xpoints)):
    ypoints.append(round((ypoints1[i] + ypoints2[i] + ypoints3[i]) / 3, 2))

plt.plot(xpoints, ypoints1, label='1st')
plt.plot(xpoints, ypoints2, label='2nd')
plt.plot(xpoints, ypoints3, label='3rd')
plt.plot(xpoints, ypoints, '-ro', label='Mean')

plt.title("NUM_OF_NODE = 5");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("COMPLETE_TIME (ms)")
plt.legend()
plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()