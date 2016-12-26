import { global } from "nativescript-angular/lang-facade";
import { Property } from "ui/core/dependency-observable";
import { PropertyMetadata } from "ui/core/proxy";
import { View } from "ui/core/view";
import { PropertyMetadataSettings, PropertyChangeData } from "ui/core/dependency-observable";
import * as common from "./recycler.view-common";

// register the setNativeValue callbacks
(<PropertyMetadata>common.RecyclerView.layoutManagerProperty.metadata).onSetNativeValue = onLayoutManagerPropertyChanged;
(<PropertyMetadata>common.RecyclerView.adapterProperty.metadata).onSetNativeValue = onAdapterPropertyChanged;

// global.moduleMerge(common, exports);

function onLayoutManagerPropertyChanged(data: PropertyChangeData) {
  console.log("RecyclerView onLayoutManagerPropertyChanged, old value: ", data.oldValue, ", new value: ", data.newValue);
  var recyclerView = <RecyclerView>data.object;
  if (recyclerView.android) {
    recyclerView.android.setLayoutManager(data.newValue);
  }
}

function onAdapterPropertyChanged(data: PropertyChangeData) {
  console.log("RecyclerView onAdapterPropertyChanged, old value: ", data.oldValue, ", new value: ", data.newValue);
  var recyclerView = <RecyclerView>data.object;
  if (recyclerView.android) {
    recyclerView.android.setAdapter(data.newValue);
  }
}


export class RecyclerView extends common.RecyclerView {

  private _android: android.support.v7.widget.RecyclerView;

  get android() {
    return this._android;
  }

  get _nativeView() {
    return this._android;
  }

  public _createUI() {
    this._android = new android.support.v7.widget.RecyclerView(this._context);
  }
}




