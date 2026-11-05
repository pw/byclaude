from jupiter import *
from skyfield import almanac
def sun_alt(o): return o.observe(eph['sun']).apparent().altaz()[0].degrees
# Garsdale, Dec 1799 (walking to Grasmere): when was Jupiter up, day or night?
g = earth + wgs84.latlon(54.32, -2.40)
print("Garsdale, Dec 1799")
for d in (18, 19, 20):
    for h in (8, 12, 16, 18, 21):
        t = ts.utc(1799, 12, d, h); o = g.at(t)
        a, z, _ = o.observe(planets['Jupiter']).apparent().altaz()
        va, vz, _ = o.observe(planets['Venus']).apparent().altaz()
        print(f"  {d} {h:02d}Z sun {sun_alt(o):4.0f}  Jupiter {a.degrees:4.0f}/{z.degrees:4.0f} {compass(z.degrees):3s} mag {float(planetary_magnitude(earth.at(t).observe(planets['Jupiter']))):.1f}   Venus {va.degrees:4.0f}/{vz.degrees:4.0f}")
# Calais, Aug 1802 evenings: "the evening star"
c = earth + wgs84.latlon(50.95, 1.85)
print("Calais, Aug 1802, sun 8 deg below horizon")
for d in (2, 10, 20, 28):
    t0 = ts.utc(1802, 8, d, 18); t1 = ts.utc(1802, 8, d, 22)
    ts_ = ts.linspace(t0, t1, 241)
    sa = c.at(ts_).observe(eph['sun']).apparent().altaz()[0].degrees
    i = int(abs(sa + 8).argmin()); t = ts_[i]; o = c.at(t)
    out = []
    for n, b in planets.items():
        a, z, _ = o.observe(b).apparent().altaz()
        if a.degrees > 0: out.append(f"{n} {a.degrees:.0f}°/{compass(z.degrees)} mag {float(planetary_magnitude(earth.at(t).observe(b))):.1f}")
    print(f"  Aug {d} {t.utc_strftime('%H:%M')}Z:", '; '.join(out))
# Great conjunction 1802
t0, t1 = ts.utc(1802, 1, 1), ts.utc(1802, 12, 31)
tt = ts.linspace(t0, t1, 3000)
e = earth.at(tt)
sep = e.observe(planets['Jupiter']).separation_from(e.observe(planets['Saturn'])).degrees
i = sep.argmin(); print("closest Jupiter–Saturn 1802:", tt[i].utc_strftime('%Y-%m-%d'), f"{sep[i]:.2f}°", " Jan 29 sep", f"{sep[int((ts.utc(1802,1,29)-t0)/(t1-t0)*2999)]:.2f}°")
