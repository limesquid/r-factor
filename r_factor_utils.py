import os
import platform
import subprocess

def node_bridge(data, node_bin, bin, args=[]):
  env = None
  startupinfo = None
  os_name = get_os()
  if os_name == 'osx':
    # GUI apps in OS X doesn't contain .bashrc/.zshrc set paths
    env = os.environ.copy()
    env['PATH'] += ':/usr/local/bin'
  elif os_name == 'windows':
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
  try:
    p = subprocess.Popen(
      [node_bin, bin] + args,
      stdout=subprocess.PIPE,
      stdin=subprocess.PIPE,
      stderr=subprocess.PIPE,
      env=env,
      startupinfo=startupinfo
    )
  except OSError:
    raise Exception('Error: Couldn\'t find "node" in "%s"' % env['PATH'])
  stdout, stderr = p.communicate(input=data.encode('utf-8'))
  stdout = stdout.decode('utf-8')
  stderr = stderr.decode('utf-8')
  if stderr:
    raise Exception('Error: %s' % stderr)
  else:
    return stdout

def get_os():
  if platform.system() == 'Darwin':
    return 'osx'
  elif  platform.system() == 'Windows':
    return 'windows'
  return 'linux'
