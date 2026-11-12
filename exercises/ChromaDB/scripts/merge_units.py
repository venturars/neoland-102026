from settings import MERGE_BELOW, MERGE_MAX


def merge_units(units: list[dict]) -> list[list[dict]]:
    if len(units) == 0:
        return []

    groups = []
    group = [units[0]]
    size = len(units[0]["heading"]) + len(units[0]["content"])
    for unit in units[1:]:
        unit_size = len(unit["heading"]) + len(unit["content"])
        same_parent = (
            unit["parent"] == group[0]["parent"]
            and unit["page"] == group[0]["page"]
        )
        # Se junta mientras el grupo sea pequeño y no pase del máximo
        if (
            same_parent
            and size < MERGE_BELOW
            and size + unit_size <= MERGE_MAX
        ):
            group.append(unit)
            size = size + unit_size
            continue
        groups.append(group)
        group = [unit]
        size = unit_size
    groups.append(group)
    return groups
