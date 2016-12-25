import { CrossView } from "./cross-view.factory";
import { ChangeDetectorRef } from "@angular/core";
import { View } from "ui/core/view";

type ExtendedViewHolderType = android.support.v7.widget.RecyclerView.ViewHolder & {crossView: CrossView<any>};

let ExtendedViewHolderClass : new (crossView: CrossView<any>) => ExtendedViewHolderType;
function ensureExtendedViewHolderClass() {

    if (ExtendedViewHolderClass) {
        return;
    }

    class ExtendedViewHolder extends android.support.v7.widget.RecyclerView.ViewHolder {

        constructor(public crossView: CrossView<any>) {
            super(crossView.android);
            return global.__native(this);
        }
    }

    ExtendedViewHolderClass = ExtendedViewHolder;
}

let RecyclerViewAdapterClass : new (itemViewFactoryFunction: () => CrossView<any>, recyclerViewNs: View, listItems: any[]) => android.support.v7.widget.RecyclerView.Adapter;
function ensureRecyclerViewAdapterClass() {

    if (RecyclerViewAdapterClass) {
        return;
    }

    class RecyclerViewAdapter extends android.support.v7.widget.RecyclerView.Adapter {
        constructor(private itemViewFactoryFunction: () => CrossView<any>, private recyclerViewNs: View, private listItems: any[]) {
            super();
            return global.__native(this);
        }

        onCreateViewHolder(parent: android.view.ViewGroup, viewType: number) {
            // create new view from template
            let itemView: CrossView<any> = this.itemViewFactoryFunction();

            // integrate new view in ns tree, so that css, properties,.. are applied
            this.recyclerViewNs._addView(itemView.ns);

            // set item height to WRAP_CONTENT so that it does not expand to whole screen
            let layoutParams = new android.support.v7.widget.RecyclerView.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
            itemView.android.setLayoutParams(layoutParams);

            ensureExtendedViewHolderClass();
            let viewHolderInstance = new ExtendedViewHolderClass(itemView);
            return viewHolderInstance;
        }

        onBindViewHolder(viewHolder: ExtendedViewHolderType, position: number) {
            // update bindings
            let context = viewHolder.crossView.ng.context;
            context.$implicit = this.listItems[position];
            context.goal = this.listItems[position];

            // ng: detect changes
            const childChangeDetector = <ChangeDetectorRef>(<any>(viewHolder.crossView.ng));
            childChangeDetector.detectChanges();
        }

        getItemCount() {
            return this.listItems.length;
        }
    }

    RecyclerViewAdapterClass = RecyclerViewAdapter;
}

export function getRecyclerViewAdapterClass() {
    ensureRecyclerViewAdapterClass();
    return RecyclerViewAdapterClass;
}