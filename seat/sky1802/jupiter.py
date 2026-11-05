# "Jupiter at least we call him, but William says we always call the largest star Jupiter."
# Dorothy Wordsworth, Grasmere, 29 Jan 1802. Was William right? Check her Grasmere Jupiters.
from skyfield.api import load, wgs84, Star
from skyfield.magnitudelib import planetary_magnitude

eph = load('/tmp/sky1798/de440.bsp')
ts = load.timescale()
earth = eph['earth']
here = earth + wgs84.latlon(54.459, -3.024)   # Dove Cottage, Town End, Grasmere

planets = {'Venus': eph['venus'], 'Mars': eph['mars barycenter'], 'Jupiter': eph['jupiter barycenter'],
           'Saturn': eph['saturn barycenter'], 'Mercury': eph['mercury']}
# the first-magnitude stars a person might call "the largest star" (J2000 RA h, Dec deg, V mag)
stars = {'Sirius': (6.7525, -16.716, -1.46), 'Arcturus': (14.261, 19.182, -0.05),
         'Vega': (18.6156, 38.784, 0.03), 'Capella': (5.2782, 45.998, 0.08),
         'Rigel': (5.2423, -8.202, 0.13), 'Procyon': (7.655, 5.225, 0.34),
         'Betelgeuse': (5.9195, 7.407, 0.5), 'Aldebaran': (4.5987, 16.509, 0.85),
         'Altair': (19.8464, 8.868, 0.76), 'Deneb': (20.6905, 45.28, 1.25),
         'Pollux': (7.7553, 28.026, 1.14), 'Regulus': (10.1395, 11.967, 1.35),
         'Spica': (13.4199, -11.161, 0.97), 'Antares': (16.4901, -26.432, 1.0)}

def compass(az):
    pts = 'N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW'.split()
    return pts[int((az + 11.25) // 22.5) % 16]

def sky(label, y, m, d, h, mi=0):
    t = ts.utc(y, m, d, h, mi)
    o = here.at(t)
    sun_alt = o.observe(eph['sun']).apparent().altaz()[0].degrees
    rows = []
    for n, b in planets.items():
        alt, az, _ = o.observe(b).apparent().altaz()
        mag = float(planetary_magnitude(earth.at(t).observe(b)))
        rows.append((mag, n, alt.degrees, az.degrees))
    for n, (ra, dec, mag) in stars.items():
        alt, az, _ = o.observe(Star(ra_hours=ra, dec_degrees=dec)).apparent().altaz()
        rows.append((mag, n, alt.degrees, az.degrees))
    up = sorted(r for r in rows if r[2] > 5)
    print(f"{label}  {t.utc_strftime('%Y-%m-%d %H:%M')}Z  sun alt {sun_alt:.0f}°")
    for mag, n, alt, az in up[:5]:
        print(f"    {n:10s} mag {mag:5.2f}  alt {alt:4.0f}°  az {az:4.0f}° {compass(az)}")

if __name__ == '__main__':
    print("1800, the Monday after Sat 8 Nov: 'Jupiter over the hilltops, the only star, like a sun'")
    for h in (17, 20, 23, 2):
        sky('', 1800, 11, 10 if h > 12 else 11, h)
    print("\n1801 Dec 17, coming out of Ambleside: 'Jupiter was very glorious above the Ambleside hills'")
    for h in (16, 17, 18, 19):
        sky('', 1801, 12, 17, h, 30)
    print("\n1802 Jan 29, returning from Ambleside: 'Jupiter behind' (walking NW, so behind = SE)")
    for h in (17, 18, 19):
        sky('', 1802, 1, 29, h, 30)
