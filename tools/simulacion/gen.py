exec(open('sim2.py').read().split('cands=')[0])
W2={'t':(35,45,20),'c':(30,20,50),'b':(15,65,20)}
rows=[]
for day in range(1,32):
  d=datetime.date(2026,10,day)
  p=((datetime.datetime(2026,10,day,12)-ref).total_seconds()/86400/S)%1
  rows.append(f"[{day},{p:.3f},{round(sc('t',d,W2['t']))},{round(sc('c',d,W2['c']))},{round(sc('b',d,W2['b']))}]")
print('['+','.join(rows)+']')
