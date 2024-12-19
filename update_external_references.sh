#!/bin/bash

# Function to update external script and stylesheet references
update_references() {
    local file="$1"
    
    # Add type="module" to external scripts
    sed -i 's/<script src="\(https:\/\/[^"]*\)">/<script type="module" src="\1">/g' "$file"
    
    # Remove duplicate base path for external resources
    sed -i 's/src="\/lorawan_bolt\/https:/src="https:/g' "$file"
    sed -i 's/href="\/lorawan_bolt\/https:/href="https:/g' "$file"
    
    # Update local script and stylesheet references
    sed -i 's/src="\/lorawan_bolt\//src="/g' "$file"
    sed -i 's/href="\/lorawan_bolt\//href="/g' "$file"
    
    echo "Updated references in $file"
}

# Find and process all HTML files
find . -name "*.html" | while read -r file; do
    update_references "$file"
done
