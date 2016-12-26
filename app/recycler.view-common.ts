import { PropertyMetadata } from "ui/core/proxy";
import { View } from "ui/core/view";
import { Property, PropertyMetadataSettings, PropertyChangeData } from "ui/core/dependency-observable";

export class RecyclerView extends View {

    public static adapterProperty = new Property(
        "adapter",
        "RecyclerView",
        new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
    );

    public static layoutManagerProperty = new Property(
        "layoutManager",
        "RecyclerView",
        new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
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

}