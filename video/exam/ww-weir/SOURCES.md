# ww-weir — sources

Film: weir overflow rate for a circular clarifier (example figures, labelled `example` on the question card; the
end card says `Check your state's exam and formula sheet.`). Original question — not taken from any exam, vendor
item bank or prep company.

## Rules and their authority

1. **Weir overflow rate = flow in gallons per day ÷ weir length in feet (gpd/ft).**
   ABC (Association of Boards of Certification) Formula/Conversion Table — Wastewater Treatment, Collection,
   Industrial, Laboratory, copyright May 31, 2018 (the sheet supplied at ABC-format exams; hosted by WPI).
   URL: https://www.gowpi.org/wp-content/uploads/2022/07/ABC-formula-conversion-2018-WW-1.pdf
   > "Weir Overflow Rate, gpd/ft = Flow, gpd / Weir Length, ft"  (printed as a fraction)
   Unchanged in the 2023 Water Professionals International wastewater table:
   URL: https://nywea.org/wp-content/uploads/2024/04/WWT-FCT_081023_with-Pie-Wheels.pdf
   > "Weir Overflow Rate, gpd/ft = Flow, gpd / Weir Length, ft"
   State sheets say the same:
   - Florida DEP, Wastewater Treatment Formulas/Conversions, https://floridadep.gov/sites/default/files/ww-abcd-formula_0.pdf
     > "Weir Overflow, gal/day /ft = total flow, gal /day / length of weir, ft."
   - Kentucky EEC wastewater treatment formula sheet,
     https://eec.ky.gov/Environmental-Protection/Compliance-Assistance/operator-certification-program/Test%20Preparation%20Documents/WWTreatmentFormulaSheet.pdf
     > "Weir Overflow Rate, GPD/ft = Flow, GPD / Length of Weir, Ft"

2. **Weir length of a weir around a circle = its circumference = pi × diameter, and the sheet's pi is 3.14.**
   ABC 2018 table (URL above):
   > "Circumference of Circle = (3.14)(Diameter)"
   > "π or pi ... = 3.14"
   Kentucky sheet: > "Circumference = (π)(Diameter)  π = 3.14"
   Michigan EGLE wastewater formula sheet (rev. 6/2026),
   https://www.michigan.gov/egle/-/media/Project/Websites/egle/Documents/Programs/WRD/Operator-Certification/Wastewater-Operations-Formula-Sheet.pdf
   > "π (pi) = 3.14"  > "Circumference of a circle = π x diameter"
   The question itself says "Using 3.14 for pi", so no sheet difference can change the key. (With full-precision
   pi the answer would be 1,800,000 / 157.08 = 11,459 gpd/ft; still nearest option C, and no other option is close.)

3. **MGD = million gallons per day, so 1 MGD = 1,000,000 gpd.**
   ABC 2018 table, abbreviations: > "MGD ....million US gallons per day"
   Florida DEP sheet: > "MGD  Million gallons per day"

4. **The trap: area goes with SURFACE overflow rate, not weir overflow rate.**
   ABC 2018 table: > "Surface Loading Rate or Surface Overflow Rate, gpd/ft2 = Flow, gpd / Area, ft2"
   > "Area of Circle = (3.14)(Radius2)"

Why the question says the weir "runs around the full outer edge": the weir length is the circumference only when
the weir sits on the tank's 50 ft wall; an inboard launder would be shorter. Pinned in the question.

## Worked example (illustrative figures)

- weir length = 3.14 × 50 = 157 ft
- flow = 1.8 MGD × 1,000,000 = 1,800,000 gpd
- weir overflow rate = 1,800,000 ÷ 157 = 11,464.97 → rounded to 11,465 gpd/ft → answer **C) 11,465 gpd/ft**

The distractors, each wrong for a stated reason:
- A) 36,000 gpd/ft — divides by the diameter, not the circumference: 1,800,000 ÷ 50 = 36,000.
- B) 22,930 gpd/ft — uses the radius in the circumference (3.14 × 25 = 78.5 ft, half the edge):
  1,800,000 ÷ 78.5 = 22,929.94 → 22,930.
- D) 917 gpd/ft — divides by the tank's surface area: 3.14 × 25 × 25 = 1,962.5 sq ft;
  1,800,000 ÷ 1,962.5 = 917.20 → 917. That is the surface overflow rate (gpd per sq ft), a different quantity.
  This is the trap line on screen: "D) 917 divides by the tank's area. That is surface overflow rate, not weir overflow rate."

Radius = 50 ÷ 2 = 25 ft (used only in the distractor arithmetic and the trap line).

Other numbers on screen: countdown ring digits 5, 4, 3, 2, 1 (a five-second pause timer, not data).
