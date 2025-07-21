type FilterValue = string | number | boolean;
type Operator = "!" | ">" | "<" | "";

interface FilterCondition {
  field: string;
  value: FilterValue | FilterValue[];
  operator: Operator;
}

class Filter {
  protected filters: FilterCondition[] = [];

  protected add(field: string, value: FilterValue | FilterValue[], operator: Operator = ""): this {
    this.filters.push({ field, value, operator });
    return this;
  }

  protected build(): string {
    return this.filters.map(({ field, value, operator }) => {
      if (Array.isArray(value)) {
        return `${field}:${value.map((v) => operator + v).join("|")}`;
      } else {
        return `${field}:${operator}${value}`;
      }
    }).join(",");
  }

  toString(): string {
    return `filter=${this.build()}`;
  }
}

export type { FilterValue, Operator };
export { Filter };
