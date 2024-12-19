#!/bin/bash

# Function to update asset paths in HTML files
update_asset_paths() {
    local file="$1"
    
    # Update CSS links
    sed -i 's/href="\([^"]*\.css\)"/href="\/lorawan_bolt\/\1"/g' "$file"
    
    # Update JS script sources
    sed -i 's/src="\([^"]*\.js\)"/src="\/lorawan_bolt\/\1"/g' "$file"
    
    # Update image sources
    sed -i 's/src="\([^"]*\.\(png\|jpg\|jpeg\|gif\|svg\)\)"/src="\/lorawan_bolt\/\1"/g' "$file"
    
    echo "Updated asset paths in $file"
}

# Find and process all HTML files
find . -name "*.html" | while read -r file; do
    update_asset_paths "$file"
done
