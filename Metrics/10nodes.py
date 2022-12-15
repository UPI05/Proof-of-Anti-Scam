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
ypoints1 = np.array([2251, 2189, 1149, 1445, 1283, 2034, 2137, 2257, 2560, 1957, 1823, 2768, 2185, 2197, 2173, 1885, 1662, 2089, 2270, 2326])
ypoints2 = np.array([1114, 1599, 1658, 2346, 1969, 1288, 2641, 1899, 2010, 2217, 2437, 1829, 2627, 2054, 2184, 2076, 2418, 1973, 2093, 2347])
ypoints3 = np.array([2150, 663, 1569, 1591, 2237, 2255, 1564, 1521, 1869, 2192, 2418, 2327, 1841, 1929, 2488, 2248, 2599, 2374, 2309, 2336])
xpoints = np.array(x)
ypoints = []

for i in range(len(xpoints)):
    ypoints.append(round((ypoints1[i] + ypoints2[i] + ypoints3[i]) / 3, 2))

plt.plot(xpoints, ypoints1, label='1st')
plt.plot(xpoints, ypoints2, label='2nd')
plt.plot(xpoints, ypoints3, label='3rd')
plt.plot(xpoints, ypoints, '-ro', label='Mean')

plt.title("NUM_OF_NODE = 10");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("COMPLETE_TIME (ms)")
plt.legend()
plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()