import { AccountFilter } from "./account-filter";
import { CategoryFilter } from "./category-filter";
import { DateFilter } from "./date-filter";

export const Filters = () => {
    return <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
        <AccountFilter/>
        <CategoryFilter/>
        <DateFilter/>
    </div>
};
