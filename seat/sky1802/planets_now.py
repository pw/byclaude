from jupiter import *
from skyfield import almanac
def p(y,m,d,h,mi=0):
    t = ts.utc(y,m,d,h,mi); o = here.at(t)
    print(t.utc_strftime('%Y-%m-%d %H:%MZ'))
    for n,b in planets.items():
        alt,az,_ = o.observe(b).apparent().altaz()
        print(f"   {n:8s} mag {float(planetary_magnitude(earth.at(t).observe(b))):5.2f} alt {alt.degrees:5.1f} az {az.degrees:5.1f} {compass(az.degrees)}")
def risings(name, y,m,d):
    t0 = ts.utc(y,m,d,12); t1 = ts.utc(y,m,d+1,12)
    f = almanac.risings_and_settings(eph, planets[name], wgs84.latlon(54.459,-3.024))
    t, e = almanac.find_discrete(t0, t1, f)
    print(f"  {name} {y}-{m:02d}-{d:02d}:", ', '.join(f"{'rise' if ei else 'set'} {ti.utc_strftime('%H:%M')}Z" for ti,ei in zip(t,e)))
for args in [(1800,11,10),(1801,12,17),(1802,1,29)]:
    for n in ('Venus','Mars','Jupiter','Saturn'): risings(n,*args)
p(1801,12,17,17,30); p(1802,1,29,18,30)
