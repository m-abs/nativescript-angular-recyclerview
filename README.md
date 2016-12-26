# NativeScript-Angular Recyclerview Sample
A NativeScript-Angular project that illustrates the use of ViewHolders (reusable Views) to optimize performance in common UI widgets like ListView, CardView etc.

## Intro
Sometimes it can be challenging to combine Angular/NativeScript Core with specialized optimized native widgets in Android and iOS.
This sample project can serve as inspiration and to make first steps easier.

The project contains a sample of a ListView like Angular component that is internally implemented by native Android widget [RecyclerView](https://developer.android.com/training/material/lists-cards.html). 
The list widget can be substituted by all kinds of other widgets like `CardView`  - just change [RecyclerView.Adapter and LinearLayoutManager](https://github.com/flexxis/nativescript-angular-recyclerview/blob/master/app/recycler-view-list.component.ts#L57-L58) to your needs.

NOTE: In iOS currently there is no support because of my lack of knowledge concerning the platform. Contributions are welcome.


