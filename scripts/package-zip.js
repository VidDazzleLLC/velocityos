const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist');
const zipFile = path.join(distDir, 'VelocityOS_v1.0.zip');

try {
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }

  // A very basic zip implementation for different platforms
  if (process.platform === 'win32') {
    // Windows PowerShell zip
    const filesToZip = `"${path.join(distDir, 'VelocityOS Setup 1.0.0.exe')}"`;
    execSync(`powershell.exe -nologo -noprofile -command "Compress-Archive -Path ${filesToZip} -DestinationPath ${zipFile}"`);
  } else {
    // Unix/Mac zip
    // Check which installer was built and zip it
    const hasPkg = fs.existsSync(path.join(distDir, 'VelocityOS-1.0.0.pkg'));
    const hasExe = fs.existsSync(path.join(distDir, 'VelocityOS Setup 1.0.0.exe'));

    let zipCommand = `cd "${distDir}" && zip -r "${zipFile}"`;
    if (hasPkg) zipCommand += ` "VelocityOS-1.0.0.pkg"`;
    if (hasExe) zipCommand += ` "VelocityOS Setup 1.0.0.exe"`;

    execSync(zipCommand);
  }

  console.log(`Successfully created ${zipFile}`);
} catch (error) {
  console.log('Note: Packaging zip may require manual steps or different files based on OS built.');
  console.error(error.message);
}
