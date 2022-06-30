import yaml
import pandas as pd

jsonStream = \
[
  {
    "name": "Bragi",
    "instr": "f5560A",
    "mode": "SOCKET",
    "address": "129.196.138.113",
    "port": "3490",
    "gpib": "6"
  },
  {
    "name": "Víðarr",
    "instr": "f5730A",
    "mode": "SOCKET",
    "address": "00.000.00.000",
    "port": "3490",
    "gpib": "7"
  }
]

YAMLstream = \
"""
---
- name: Bragi
  instr: f5560A
  mode: SOCKET
  address: 129.196.138.113
  port: '3490'
  gpib: '6'
  
- name: Víðarr
  instr: f5730A
  mode: SOCKET
  address: 00.000.00.000
  port: '3490'
  gpib: '7'

"""

d = yaml.safe_load(YAMLstream)
print(d, '\n')
"""
[
  {'name': 'Bragi', 'instr': 'f5560A', 'mode': 'SOCKET', 'address': '129.196.138.113', 'port': '3490', 'gpib': '6'},
  {'name': 'Víðarr', 'instr': 'f5730A', 'mode': 'SOCKET', 'address': '00.000.00.000', 'port': '3490', 'gpib': '7'}
]
"""

df = pd.DataFrame(d)
print(df, '\n')
"""
    name    instr   mode      address           port  gpib
0   Bragi   f5560A  SOCKET    129.196.138.113   3490  6
1   Víðarr  f5730A  SOCKET    00.000.00.000     3490  7
"""
# df['name'] = range(1, len(df) + 1)
# df = df.reset_index()


