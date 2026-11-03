# Dorothy Wordsworth's sky at Alfoxden, 1798, against DE440.
import sys
from skyfield.api import load, wgs84
from skyfield import almanac

eph = load('/tmp/sky1798/de440.bsp')
ts = load.timescale()
earth, sun, moon = eph['earth'], eph['sun'], eph['moon']
venus, jup = eph['venus'], eph['jupiter barycenter']
alfox = wgs84.latlon(51.163, -3.215)   # Alfoxden Park, Holford, Quantocks
here = earth + alfox

def at(y, m, d, h, mi=0):
    t = ts.utc(y, m, d, h, mi)
    out = {}
    for name, body in [('sun', sun), ('moon', moon), ('venus', venus), ('jupiter', jup)]:
        alt, az, _ = here.at(t).observe(body).apparent().altaz()
        out[name] = (alt.degrees, az.degrees)
    ill = almanac.fraction_illuminated(eph, 'moon', t)
    el = almanac.moon_phase(eph, t).degrees   # 0 new, 90 first q, 180 full
    sep = here.at(t).observe(venus).apparent().separation_from(here.at(t).observe(jup).apparent()).degrees
    return t, out, ill, el, sep

def show(label, y, m, d, h, mi=0):
    t, o, ill, el, sep = at(y, m, d, h, mi)
    def f(k): a, z = o[k]; return f"{k} alt {a:5.1f} az {z:5.1f}"
    print(f"{label}\n  {t.utc_strftime('%Y-%m-%d %H:%M')}Z  moon {ill*100:4.0f}% lit, phase {el:5.1f}°  Venus–Jupiter {sep:4.1f}°")
    for k in ('sun', 'moon', 'venus', 'jupiter'):
        print('   ', f(k))

if __name__ == '__main__':
    t0, t1 = ts.utc(1798, 1, 1), ts.utc(1798, 6, 1)
    t, y = almanac.find_discrete(t0, t1, almanac.moon_phases(eph))
    for ti, yi in zip(t, y):
        print(ti.utc_strftime('%Y-%m-%d %H:%M'), almanac.MOON_PHASES[yi])
