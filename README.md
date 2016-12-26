# NativeScript-Angular Recyclerview Sample
A NativeScript-Angular project that illustrates the use of ViewHolders (reusable Views) to optimize performance in common UI widgets like ListView, CardView etc.

## Intro
Sometimes it can be challenging to combine different platforms and use specialized optimized native widgets at the same time. 
This sample project can serve as inspiration and to make first steps easier.

In Android the concept of ViewHolders is implemented by [RecyclerView](https://developer.android.com/training/material/lists-cards.html). In iOS currently there is no support because of my lack of knowledge concerning the platform.

The project is a sample of a ListView like Angular component that is internally implemented by native Android `RecyclerView`. 
ListView can be substituted by all kinds of other widgets like `CardView`  - just change [RecyclerView.Adapter and LinearLayoutManager](https://github.com/flexxis/nativescript-angular-recyclerview/blob/master/app/recycler-view-list.component.ts#L57-L58) to your needs.

