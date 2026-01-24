# velocityos
VelocityOS is a next‑gen AI business OS that automates routine work

## Development Guide

### Handling Merge Conflicts with package-lock.json

When you encounter merge conflicts in `package-lock.json` files:

1. **Resolve conflicts in package.json first** (if any)
   - Make sure you have the correct dependencies and versions in `package.json`
   
2. **Regenerate package-lock.json** (Recommended approach)
   ```bash
   # Delete the conflicted package-lock.json
   rm package-lock.json
   
   # Regenerate it with npm
   npm install
   
   # Commit the regenerated file
   git add package-lock.json
   git commit -m "Regenerate package-lock.json after merge conflict"
   ```

3. **Manual resolution** (Alternative approach)
   - With the `.gitattributes` configuration in this repository, you can now manually resolve conflicts in `package-lock.json`
   - The "Mark as resolved" button will be enabled in GitHub's merge conflict UI
   - However, regenerating the file (option 2) is still recommended to ensure file integrity

### Multiple package-lock.json Files

This repository has multiple `package-lock.json` files:
- Root: `/package-lock.json`
- Frontend: `/velocity-os-rebuilt/package-lock.json`
- Backend: `/functions/package-lock.json`

Apply the same conflict resolution approach to each file as needed.
