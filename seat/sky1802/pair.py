# "two stars near her, one larger than the other" — did she see Jupiter+Saturn with the moon, unnamed?
from jupiter import *
from skyfield import almanac
def look(label, lat, lon, y, m, d, hours):
    site = earth + wgs84.latlon(lat, lon)
    print(label)
    for h in hours:
        t = ts.utc(y, m, d, int(h), int(round((h % 1) * 60))); o = site.at(t)
        sa = o.observe(eph['sun']).apparent().altaz()[0].degrees
        mo = o.observe(eph['moon']).apparent(); ma, mz, _ = mo.altaz()
        ill = almanac.fraction_illuminated(eph, 'moon', t)
        row = f"  {t.utc_strftime('%H:%M')}Z sun {sa:4.0f}  moon {ill*100:3.0f}% alt {ma.degrees:3.0f} az {mz.degrees:3.0f}"
        for n in ('Jupiter', 'Saturn', 'Mars', 'Venus'):
            p = o.observe(planets[n]).apparent(); pa = p.altaz()[0].degrees
            row += f" | {n[:3]} {mo.separation_from(p).degrees:5.1f}° alt {pa:3.0f} m{float(planetary_magnitude(earth.at(t).observe(planets[n]))):4.1f}"
        print(row)
    # bright stars within 15 deg of the moon
    t = ts.utc(y, m, d, int(hours[1])); o = site.at(t); mo = o.observe(eph['moon']).apparent()
    near = [(mo.separation_from(o.observe(Star(ra_hours=r, dec_degrees=dd)).apparent()).degrees, n, mg) for n, (r, dd, mg) in stars.items()]
    print("   first-mag stars near the moon:", ', '.join(f"{n} {s:.0f}° (m{mg})" for s, n, mg in sorted(near)[:3]))
look("Tue 16 Mar 1802, Grasmere, evening walk to look at Rydale: 'two stars beside her … like butterflies'",
     54.459, -3.024, 1802, 3, 16, [19, 20.5, 22])
look("Mon 12 Apr 1802, Eusemere→Barton, Ullswater: 'two stars near her, one larger than the other'",
     54.615, -2.82, 1802, 4, 12, [20, 21.5, 23])
