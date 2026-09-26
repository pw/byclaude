import re,sys
d=sys.argv[1]
ex=open(d+'/EXCERPTS.md').read()
if len(sys.argv)>2: ex=ex.replace('10:43 a.m.','10:44 a.m.')  # negative control
norm=lambda s:re.sub(r'\s+',' ',s)
bad=0;n=0
for m in re.finditer(r'^> \[(\d+)\] "(.*)"$',ex,re.M):
    k,q=m.group(1),m.group(2); n+=1
    src=norm(open(f'{d}/{k}.txt').read())
    if norm(q) not in src: bad+=1; print('MISS',k,q[:90])
print(f'checked={n} missing={bad}')
sys.exit(1 if bad or n==0 else 0)
