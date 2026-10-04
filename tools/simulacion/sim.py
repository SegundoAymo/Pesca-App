import math,datetime
ref=datetime.datetime(2000,1,6,18,14);S=29.530588853
W=[23,23,21,17.5,13.5,10,9.4,10.5,13,16.5,19.5,22]  # agua laguna pampeana estimada
def pw(x,pts):
  if x<=pts[0][0]:return pts[0][1]
  for (a,fa),(b,fb) in zip(pts,pts[1:]):
    if x<=b:return fa+(fb-fa)*(x-a)/(b-a)
  return pts[-1][1]
RESP={'t':[(11,0),(21,1),(28,1),(32,.7)],'c':[(8,0),(12.5,.25),(17.5,.6),(22,1),(28,1),(32,.8)],'b':[(6,0),(12,.4),(18,1),(28,1),(31,.7)]}
def water(d):
  # interpolate monthly anchors at day 15, cyclic
  y=d.year;anchors=[]
  for k in range(-1,13):
    m=(k%12);yy=y+(k//12)
    anchors.append((datetime.date(yy,m+1,15),W[m]))
  for (a,fa),(b,fb) in zip(anchors,anchors[1:]):
    if a<=d<=b:return fa+(fb-fa)*(d-a).days/(b-a).days
def moonf(d):
  p=((datetime.datetime(d.year,d.month,d.day,12)-ref).total_seconds()/86400/S)%1
  g=(1+math.cos(2*math.pi*p))/2
  return {'t':min(1,g+0.45*(1-g)**4),'c':g,'b':g},p
WTS={'t':(45,35,20),'c':(40,20,40),'b':(15,50,35)}
def score(k,d,press=None):
  s=pw(water(d),RESP[k]);m=moonf(d)[0][k];ws,wm,wp=WTS[k]
  if press is None: return 100*(ws*s+wm*m)/(ws+wm)
  return (ws*s+wm*m+wp*press)
import collections
for label,press in (("sin presion",None),("presion neutra 0.75",0.75),("presion ideal 1.0",1.0)):
  print("==",label)
  print("mes  T_agua  tar carp bag  (dias>=70)   | max tar carp bag")
  for m in range(1,13):
    cnt=collections.Counter();mx={'t':0,'c':0,'b':0}
    d=datetime.date(2026,m,1)
    while d.month==m:
      for k in 'tcb':
        s=score(k,d,press); mx[k]=max(mx[k],s)
        if s>=70:cnt[k]+=1
      d+=datetime.timedelta(1)
    print(f"{m:3}  {W[m-1]:5}   {cnt['t']:3} {cnt['c']:4} {cnt['b']:4}               | {mx['t']:4.0f} {mx['c']:4.0f} {mx['b']:4.0f}")

print("\n##### MODELO C: compuerta de frio (G = min(1, temp/0.5))")
def scoreC(k,d,press=None):
  s=pw(water(d),RESP[k]); G=min(1,s/0.5)
  return score(k,d,press)*G
for label,press in (("sin presion",None),("presion 0.75",0.75)):
  print("==",label)
  for m in range(1,13):
    cnt=collections.Counter();mx={'t':0,'c':0,'b':0};mn={'t':999,'c':999,'b':999}
    d=datetime.date(2026,m,1)
    while d.month==m:
      for k in 'tcb':
        s=scoreC(k,d,press); mx[k]=max(mx[k],s); mn[k]=min(mn[k],s)
        if s>=70:cnt[k]+=1
      d+=datetime.timedelta(1)
    print(f"{m:3}  dias>=70 tar {cnt['t']:2} carp {cnt['c']:2} bag {cnt['b']:2} | rango tar {mn['t']:3.0f}-{mx['t']:3.0f} carp {mn['c']:3.0f}-{mx['c']:3.0f} bag {mn['b']:3.0f}-{mx['b']:3.0f}")
# temp factor table
print("\nfactor temperatura por mes")
for m in range(12):
  print(m+1, W[m], ' '.join(f"{k}:{pw(W[m],RESP[k]):.2f}" for k in 'tcb'))
