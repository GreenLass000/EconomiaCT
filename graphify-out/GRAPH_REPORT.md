# Graph Report - .  (2026-07-29)

## Corpus Check
- Corpus is ~8,912 words - fits in a single context window. You may not need a graph.

## Summary
- 211 nodes · 304 edges · 23 communities (15 shown, 8 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Project Dependencies
- Income Form Controls
- People Management API
- Main Dashboard
- Database Models
- Edit Dialogs
- App Bar Dialogs
- Record Management API
- Report Form Controls
- PDF Report Generation
- Web App Manifest
- Startup Script
- Backend Requirements
- HTML Application Shell
- React Public Logo
- React App Logo
- Brand Mark
- React SVG Logo
- Project Overview

## God Nodes (most connected - your core abstractions)
1. `get_session()` - 17 edges
2. `Person` - 14 edges
3. `Record` - 10 edges
4. `IncomeList` - 7 edges
5. `SpentList` - 7 edges
6. `init_db()` - 7 edges
7. `NewIncomeSpentModal()` - 6 edges
8. `generar_pdf()` - 5 edges
9. `add_record()` - 5 edges
10. `generar_reporte()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `init_db()` --indirect_call--> `IncomeList`  [INFERRED]
  flask_app/utils/db.py → flask_app/models/income_list.py
- `add_record()` --indirect_call--> `Person`  [INFERRED]
  flask_app/routes/record.py → flask_app/models/person.py
- `generar_reporte()` --indirect_call--> `Person`  [INFERRED]
  flask_app/routes/report.py → flask_app/models/person.py
- `generar_reporte()` --indirect_call--> `Record`  [INFERRED]
  flask_app/routes/report.py → flask_app/models/record.py
- `init_db()` --indirect_call--> `SpentList`  [INFERRED]
  flask_app/utils/db.py → flask_app/models/spent_list.py

## Import Cycles
- None detected.

## Communities (23 total, 8 thin omitted)

### Community 0 - "Project Dependencies"
Cohesion: 0.06
Nodes (35): browserslist, development, production, dependencies, axios, date-fns, @date-io/date-fns, @emotion/react (+27 more)

### Community 1 - "Income Form Controls"
Cohesion: 0.15
Nodes (13): AmountInput(), ConcertedCheckbox(), CustomDatePicker(), ItemSelector(), PersonSelector(), TypeSelector(), defaultInitialValues, createFormHandlers() (+5 more)

### Community 2 - "People Management API"
Cohesion: 0.14
Nodes (18): Person, Modelo que representa la tabla Person en la base de datos., add_person(), delete_person(), disable_person(), get_active_persons(), get_persons(), Endpoint para obtener todas las personas.      Devuelve:         Una lista de (+10 more)

### Community 3 - "Main Dashboard"
Cohesion: 0.13
Nodes (11): App(), CustomTextBox(), DeleteDialog(), EditDialog(), FeedbackSnackbar(), TableBodyContent(), DetailTable(), GridItem (+3 more)

### Community 4 - "Database Models"
Cohesion: 0.14
Nodes (9): Base, IncomeList, Modelo que representa la tabla IncomeList en la base de datos., Modelo que representa la tabla SpentList en la base de datos., SpentList, get_incomelists(), Endpoint para obtener todas las entradas de la tabla IncomeList.      Devuelve, get_spentlists() (+1 more)

### Community 5 - "Edit Dialogs"
Cohesion: 0.19
Nodes (8): ConfirmDialog(), EditPersonDialog(), EditRecordDialog(), PersonDetailDialog(), PersonTable(), SnackbarAlert(), usePersons(), InteractiveList()

### Community 6 - "App Bar Dialogs"
Cohesion: 0.26
Nodes (8): AddPersonDialog(), GenerateReportDialog(), NewIncomeSpentDialog(), ResponsiveAppBar(), StyledDialog, StyledDialogActions, PersonForm(), NewPersonModal()

### Community 7 - "Record Management API"
Cohesion: 0.21
Nodes (10): Modelo que representa la tabla Record en la base de datos., Record, add_record(), delete_record(), get_records_by_person(), Endpoint para eliminar un registro existente., Endpoint para agregar un nuevo registro de ingreso o gasto., Endpoint para obtener todos los registros de una persona específica. (+2 more)

### Community 8 - "Report Form Controls"
Cohesion: 0.31
Nodes (5): DateRangeFields(), PersonSelector(), SnackbarAlert(), useGenerateReport(), GenerateReportModal()

### Community 9 - "PDF Report Generation"
Cohesion: 0.33
Nodes (5): generar_pdf(), get_styles(), get_table_style(), add_header_footer(), generar_reporte()

### Community 10 - "Web App Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

## Knowledge Gaps
- **46 isolated node(s):** `name`, `version`, `private`, `@date-io/date-fns`, `@emotion/react` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get_session()` connect `People Management API` to `PDF Report Generation`, `Database Models`, `Record Management API`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `Person` connect `People Management API` to `PDF Report Generation`, `Database Models`, `Record Management API`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `get_session()` (e.g. with `get_incomelists()` and `add_person()`) actually correct?**
  _`get_session()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `Person` (e.g. with `add_person()` and `delete_person()`) actually correct?**
  _`Person` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `Record` (e.g. with `add_record()` and `delete_record()`) actually correct?**
  _`Record` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `IncomeList` (e.g. with `get_incomelists()` and `init_db()`) actually correct?**
  _`IncomeList` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Modelo que representa la tabla IncomeList en la base de datos.`, `Modelo que representa la tabla Person en la base de datos.`, `Modelo que representa la tabla Record en la base de datos.` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._