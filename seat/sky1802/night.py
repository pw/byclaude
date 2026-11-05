from jupiter import *
from skyfield import almanac
import sys
y,m,d = map(int, sys.argv[1:4])
for h in range(15, 31):
    t = ts.utc(y,m,d,h) if h<24 else ts.utc(y,m,d+1,h-24)
    o = here.at(t)
    s = o.observe(eph['sun']).apparent().altaz()[0].degrees
    ma, mz, _ = o.observe(eph['moon']).apparent().altaz()
    ill = almanac.fraction_illuminated(eph,'moon',t)
    ja, jz, _ = o.observe(planets['Jupiter']).apparent().altaz()
    sa, sz, _ = o.observe(planets['Saturn']).apparent().altaz()
    ir = o.observe(Star(ra_hours=6.7525, dec_degrees=-16.716)).apparent().altaz()
    print(f"{t.utc_strftime('%m-%d %H')}Z sun {s:4.0f}  moon {ill*100:3.0f}% {ma.degrees:4.0f}/{mz.degrees:4.0f}  Jup {ja.degrees:4.0f}/{jz.degrees:4.0f} {compass(jz.degrees):3s}  Sat {sa.degrees:4.0f}/{sz.degrees:4.0f}  Sirius {ir[0].degrees:4.0f}/{ir[1].degrees:4.0f}")
