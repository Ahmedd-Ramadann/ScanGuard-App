# Understand the code before presenting it

## What comes from the labs

| Lab idea | Where it appears |
| --- | --- |
| Lab 01: View, Text, Pressable, StyleSheet | Every screen and shared buttons |
| Lab 01 / 02: TextInput with value and onChangeText | Search in History and text in QR Generator |
| Lab 02: props and function props | onBack, onReport, onSelect passed from navigation |
| Lab 02: useState | Selected filter, confirmation, input and current screen |
| Lab 02: conditional rendering | Empty lists, loading messages, QR preview |
| Lab 02: arrays, keys and filtering | HistoryViewModel and parameter tags |
| Lab 02: FlatList | HistoryScreen renderItem and keyExtractor |
| Lab 02: Context | AnalysisProvider shares current scan and session records |
| Lab 02: useEffect and useRef | Cancel demo timers when a screen closes |

Sources: https://mobdev.vercel.app/labs/lab-01 and https://mobdev.vercel.app/labs/lab-02

## What is additional

MVVM is the chosen project architecture: move state/actions into custom hooks while screens display them. A custom hook is a normal function using React hooks; its name starts with use. Context is taught in Lab 02. The QR encoder and Expo Clipboard are libraries to learn separately. The QR algorithm was not written from scratch. The small local screen stack is our prototype navigation choice; Lab 02 uses Expo Router instead.

## Read in this order

1. `theme.ts`: a single object stores colours.
2. `HistoryViewModel.ts`: useState stores search and filter; filter() selects matching scans.
3. `HistoryScreen.tsx`: TextInput changes the search; FlatList shows matching records.
4. `AnalysisViewModel.ts`: records is a shared array. Adding/deleting creates a new array so React updates the view.
5. `AnalysisProvider.tsx`: makes that data available to different screens without repeating it.
6. `AppNavigator.tsx`: a list of screen names represents the back stack. Push adds a screen, slice removes the last one.
7. `TrackingCleaner.ts`: URLSearchParams finds and deletes a small list of known tracking keys.
8. `QrViewModel.ts`: validates the input, then asks the QR library for a matrix of dark/light cells.

## Trace one action

Scanner button -> useScannerViewModel starts a short timer -> callback gives a sample record to AppNavigator -> saveScan updates Context -> ScanResultScreen reads currentScan -> report and clean screens read the same scan.

History delete -> show confirmation -> deleteScan(id) -> filter out that record -> navigate back -> FlatList reads the updated array.

## Questions to practise answering

- Why use state instead of a normal variable? Updating state makes React render the new value.
- Why is each list item given a key? React needs a stable identity when records change.
- Why Context? Several screens need the same selected scan and history.
- Why custom hooks? To keep screen logic outside layout code and follow our MVVM plan.
- Why clear the timer? A cancelled scan must not navigate after the user has left the screen.
- Is the security result real? No. Phase 1 demonstrates the UI using labelled sample results.
- Does backup use Google Drive? No. It copies the array into another state variable for this prototype.
- What does the QR library do? It encodes the entered string; the UI draws the returned matrix.

## Make changes yourself

1. Change the Home heading and explain where the text is rendered.
2. Add a sample scan with a unique id and valid kind.
3. Change a filter label without changing the stored filter value.
4. Add another known tracking parameter and test that an unrelated parameter remains.
5. Show empty, error and loading states and explain the condition behind each.
6. Record actual edits and tests in your AI log. Do not claim assistance was your independent work.

## شرح سريع بالعربي

الـView هو شكل الشاشة. الـViewModel هو الدوال والـstate اللي بتشغّلها. الـModel هو شكل البيانات وقواعد التعامل معاها. لما بتضغط زر، الشاشة بتنادي دالة، والدالة بتغيّر state، فـReact بيرسم النتيجة الجديدة. الـContext بيخلي الشاشات تقرأ نفس البيانات بدل ما كل شاشة تعمل نسخة منفصلة.

ابدأ بفهم شاشة History لأنها تجمع الحاجات اللي في اللاب: input وstate وfilter وFlatList. جرّب تعديل صغير بنفسك وشوف تأثيره، وبعدها انتقل لمسار المسح والتقرير.
