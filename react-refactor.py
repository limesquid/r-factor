import sublime
import sublime_plugin
from subprocess import Popen, PIPE
import errno

class CommandRunner:
  def __init__(self, command):
    self.command = command

  def run(self, lines):
    process = Popen(self.command, stdin=PIPE, stdout=PIPE)
    stdout = ''
    for line in lines:
      try:
        process.stdin.write(line)
      except IOError as error:
        if error.errno == errno.EPIPE or error.errno == errno.EINVAL:
          # Stop loop on "Invalid pipe" or "Invalid argument".
          # No sense in continuing with broken pipe.
          break
        else:
          # Raise any other error.
          raise
    process.stdin.close()
    for line in process.stdout:
      stdout += line.decode()
    code = process.wait()
    if code != 0:
      print("Error exit code: {}".format(code))
    return stdout

class ConvertToComponentCommand(sublime_plugin.TextCommand):
  def __init__(self, arg):
    super(ConvertToComponentCommand, self).__init__(arg)
    self.commandRunner = CommandRunner("node d:\\Projekty\\refactor-react\\index.js")

  def run(self, edit):
    selection = self.view.sel()
    region = selection[0]
    selectedText = self.view.substr(region)
    if len(selectedText) == 0:
      region = sublime.Region(0, self.view.size())
      selectedText = self.view.substr(region)
    stdout = self.commandRunner.run([ selectedText.encode() ])
    self.view.replace(edit, region, stdout)

#view.run_command('convert_to_functional_component')
#https://github.com/yuriyyakym/sublime-es6-jsx-stack/blob/master/index.py
