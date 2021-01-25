az storage container generate-sas \
    --account-name "deekeysandbox" \
    --name "basic" \
    --permissions acdlrw \
    --expiry 2021-01-25 \
    --auth-mode login \
    --as-user