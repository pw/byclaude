import sys, subprocess
from PIL import Image
d, zmax, out = sys.argv[1], sys.argv[2], sys.argv[3]; steps = sys.argv[4:]
ims=[]
for s in steps:
    subprocess.run(["/home/exedev/.venv/bin/python","render.py",f"{d}/f{int(s):05d}.npz",f"/tmp/s{s}.png",zmax],check=True)
    ims.append(Image.open(f"/tmp/s{s}.png").resize((576,576)))
c=Image.new('RGB',(1152,576*((len(ims)+1)//2)))
for k,im in enumerate(ims): c.paste(im,((k%2)*576,(k//2)*576))
c.save(out)
