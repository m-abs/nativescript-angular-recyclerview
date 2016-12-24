import { Property } from "ui/core/dependency-observable";
import { PropertyMetadata } from "ui/core/proxy";
import { View } from "ui/core/view";

declare var android : any;

export class RecyclerView extends View {

  public static adapterProperty = new Property(
    "adapter",
    "RecyclerView",
    new PropertyMetadata(null)
  );

  public static layoutManagerProperty = new Property(
    "layoutManager",
    "RecyclerView",
    new PropertyMetadata(null)
  );

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

  get android() { return this._android; }
  get _nativeView() { return this._android; }

  public _createUI() {
    this._android = new android.support.v7.widget.RecyclerView(this._context);
    this._android.setAdapter(this.adapter);
    this._android.setLayoutManager(this.layoutManager);
  }

}
