declare namespace android {
    namespace view {
        namespace ViewGroup {
            class LayoutParams {
                static MATCH_PARENT;
                static WRAP_CONTENT;

                constructor(width: any, height: any);
            }
        }
        class ViewGroup {}
        class View {}
    }

    namespace support.v7.widget {
        namespace RecyclerView {

            class Adapter {}

            class LayoutParams extends android.view.ViewGroup.LayoutParams {
                constructor(width: any, height: any);
            }

            class ViewHolder {
                static extend: any;

                constructor(view : android.view.View);
            }

            class LayoutManager {}
        }

        class RecyclerView extends android.view.ViewGroup {
            constructor(context: any);

            setAdapter(Adapter): void;
            setLayoutManager(LinearLayoutManager): void;
        }

        class LinearLayoutManager {
            constructor(context: any);
        }
    }
}
