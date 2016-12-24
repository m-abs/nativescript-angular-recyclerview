import { CrossView } from "./recycler-view.component";
import { ChangeDetectorRef } from "@angular/core";
import { View } from "ui/core/view";

let RecyclerViewHolderClass;
function ensureRecyclerViewHolderClass() {

    if (RecyclerViewHolderClass) {
        return;
    }

    class RecyclerViewHolder extends android.support.v7.widget.RecyclerView.ViewHolder {

        constructor(public crossView: CrossView<any>) {
            super(crossView.android);
            return global.__native(this);
        }
    }

    RecyclerViewHolderClass = RecyclerViewHolder;
}


let RecyclerViewAdapterClass;
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
            let itemView: CrossView<any> = this.itemViewFactoryFunction();
            this.recyclerViewNs._addView(itemView.ns);

            let layoutParams = new android.support.v7.widget.RecyclerView.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
            itemView.android.setLayoutParams(layoutParams);

            ensureRecyclerViewHolderClass();
            let viewHolderInstance = new RecyclerViewHolderClass(itemView);
            return viewHolderInstance;
        }

        onBindViewHolder(viewHolder: android.support.v7.widget.RecyclerView.ViewHolder, position: number) {
            // update bindings
            let context = (<any>viewHolder).crossView.ng.context;
            context.$implicit = this.listItems[position];
            context.goal = this.listItems[position];

            // ng: detect changes
            const childChangeDetector = <ChangeDetectorRef>((<any>viewHolder).crossView.ng);
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