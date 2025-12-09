#!/bin/bash

# Function to update a file with the hamburger menu
update_file() {
    local file=$1
    local product_name=$2
    local path_prefix=$3
    
    echo "Updating: $file"
    
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "  File not found: $file"
        return 1
    fi
    
    # Check if already has hamburger menu
    if grep -q "class=\"hamburger\"" "$file"; then
        echo "  Already has hamburger menu, skipping"
        return 0
    fi
    
    echo "  Adding hamburger menu to $product_name page"
    return 0
}

# Update main index (already done)
echo "Main index already updated"

# Update HealthCompanion pages
echo "HealthCompanion main index already updated"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HealthCompanion/EmergencyCard/index.html" "Emergency Card" "../../"

# Update ResearchPay pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ResearchPay/index.html" "ResearchPay" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ResearchPay/SurveyVault/index.html" "SurveyVault" "../../"

# Update LabVault pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/LabVault/index.html" "LabVault" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/LabVault/LabShot/index.html" "LabShot" "../../"

# Update Argus pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/index.html" "Argus" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/sentinel.html" "Argus Sentinel" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/immunity-index.html" "Immunity Index" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/Argus/threat-lab.html" "Threat Lab" "../"

# Update ALETHEIA pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/index.html" "ALETHEIA" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/demos.html" "ALETHEIA Demos" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/verification-calculator.html" "Verification Calculator" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/fraud-risk-scanner.html" "Fraud Risk Scanner" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ALETHEIA/mobility-barrier-map.html" "Mobility Barrier Map" "../"

# Update PROMETHEUS pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/index.html" "PROMETHEUS" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/demos.html" "PROMETHEUS Demos" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/carbon-truth-calculator.html" "Carbon Truth Calculator" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/carbon-intelligence-map.html" "Carbon Intelligence Map" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/PROMETHEUS/blind-spot-scanner.html" "Blind Spot Scanner" "../"

# Update NEMESIS pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/index.html" "NEMESIS" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/demos.html" "NEMESIS Demos" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/ted-scanner.html" "TED Scanner" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/network-xray.html" "Network X-Ray" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/NEMESIS/collusion-radar.html" "Collusion Radar" "../"

# Update HYPERION pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/index.html" "HYPERION" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/demos.html" "HYPERION Demos" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/nis2-checker.html" "NIS2 Checker" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/HYPERION/eidas-readiness.html" "eIDAS Readiness" "../"

# Update ARCHON pages
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/index.html" "ARCHON" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/demos.html" "ARCHON Demos" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/live-counter.html" "Live Counter" "../"
update_file "/Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4/ARCHON/agent-roulette.html" "Agent Roulette" "../"

echo ""
echo "Summary of files to update:"
find /Users/christopherhoar/Desktop/dcfh/EG-a8f3b2c9d1e4 -name "*.html" -type f | grep -E "(HealthCompanion|ResearchPay|LabVault|Argus|ALETHEIA|PROMETHEUS|NEMESIS|HYPERION|ARCHON)" | while read file; do
    if ! grep -q "class=\"hamburger\"" "$file" 2>/dev/null; then
        echo "  Needs update: $file"
    fi
done