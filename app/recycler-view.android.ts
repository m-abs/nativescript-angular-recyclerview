import { Property } from "ui/core/dependency-observable";
import { PropertyMetadata } from "ui/core/proxy";
import { View } from "ui/core/view";
import { PropertyMetadataSettings, PropertyChangeData } from "ui/core/dependency-observable";
import * as definition from "./recycler-view.d";

export class RecyclerView extends View implements definition.RecyclerView {

  public static adapterProperty = new Property(
    "adapter",
    "RecyclerView",
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout, undefined, undefined, RecyclerView.onAdapterPropertyChanged)
  );

  public static layoutManagerProperty = new Property(
    "layoutManager",
    "RecyclerView",
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout, undefined, undefined, RecyclerView.onLayoutManagerPropertyChanged)
  );

  private static onLayoutManagerPropertyChanged(data: PropertyChangeData) {
    var recyclerView = <RecyclerView>data.object;
    if (recyclerView.android) {
      recyclerView.android.setLayoutManager(data.newValue);
    }
  }

  private static onAdapterPropertyChanged(data: PropertyChangeData) {
    var recyclerView = <RecyclerView>data.object;
    if (recyclerView.android) {
      recyclerView.android.setAdapter(data.newValue);
    }
  }

  get adapter(): android.support.v7.widget.RecyclerView.Adapter {
    return this._getValue(RecyclerView.adapterProperty);
  }

  set adapter(value: android.support.v7.widget.RecyclerView.Adapter) {
    this._setValue(RecyclerView.adapterProperty, value);
  }

  get layoutManager(): android.support.v7.widget.RecyclerView.LayoutManager {
    return this._getValue(RecyclerView.layoutManagerProperty);
  }

  set layoutManager(value: android.support.v7.widget.RecyclerView.LayoutManager) {
    this._setValue(RecyclerView.layoutManagerProperty, value);
  }

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




