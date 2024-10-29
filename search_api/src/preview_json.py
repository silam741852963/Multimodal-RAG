import json

def load_jsonl(file_path):
    """Load a JSONL file into a list of dictionaries."""
    data = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            data.append(json.loads(line.strip()))
    return data

def preview_data(data, num_entries=5):
    """Print a preview of the data (first few entries)."""
    print(f"Displaying first {num_entries} entries:")
    for i, entry in enumerate(data[:num_entries]):
        print(f"\nEntry {i + 1}:")
        print(json.dumps(entry, indent=4))

# File path to the linked data
linked_data_file = "../data/linked_All_Beauty.jsonl"

# Load and preview the linked data
linked_data = load_jsonl(linked_data_file)
preview_data(linked_data, num_entries=5)
