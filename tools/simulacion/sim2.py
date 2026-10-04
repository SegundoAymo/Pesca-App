exec(open('sim.py').read().split('import collections')[0])
import collections
def moonG(d):
  p=((datetime.datetime(d.year,d.month,d.day,12)-ref).total_seconds()/86400/S)%1
  return (1+math.cos(2*math.pi*p))/2
def sc(k,d,w,press=None):
  s=pw(water(d),RESP[k]); G=min(1,s/0.5); m=moonG(d); ws,wm,wp=w
  if press is None: v=(ws*s+wm*m)/(ws+wm)
  else: v=(ws*s+wm*m+wp*press)/(ws+wm+wp)
  return 100*v*G
cands={'t':[(45,35,20),(35,45,20),(30,50,20),(25,50,25)],'c':[(40,20,40),(30,20,50),(30,25,45),(25,25,50)],'b':[(15,50,35),(15,65,20)]}
for k,ws in cands.items():
  for w in ws:
    row=[]
    for press in (None,0.8,0.4):
      out=[]
      for m in range(1,13):
        d=datetime.date(2026,m,1);n=0
        while d.month==m:
          if sc(k,d,w,press)>=70:n+=1
          d+=datetime.timedelta(1)
        out.append(n)
      row.append(out)
    print(k,w)
    for lab,o in zip(("sinP","P=.8","P=.4"),row): print("   ",lab,' '.join(f"{x:2}" for x in o))
