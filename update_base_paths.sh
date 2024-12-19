#!/bin/bash

# Function to update links in HTML files
update_links() {
    local file="$1"
    # Update href attributes
    sed -i 's/href="\([^"]*\)"/href="\/lorawan_bolt\/\1"/g' "$file"
    # Update src attributes
    sed -i 's/src="\([^"]*\)"/src="\/lorawan_bolt\/\1"/g' "$file"
    echo "Updated links in $file"
}

# Find and process all HTML files
find . -name "*.html" | while read -r file; do
    update_links "$file"
done
