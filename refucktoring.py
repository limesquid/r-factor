import os
import sublime
import sublime_plugin
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))
from r-factor_utils import node_bridge

BIN_PATH = os.path.join(
  sublime.packages_path(),
  os.path.dirname(os.path.realpath(__file__)),
  'index.js'
)

class BaseCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    selection = self.view.sel()
    region = selection[0]
    selected_text = self.view.substr(region)
    if len(selected_text) == 0:
      region = sublime.Region(0, self.view.size())
      selected_text = self.view.substr(region)
    stdout = self.execute(selected_text, self.refactoring_name)
    if stdout != selected_text:
      self.view.replace(edit, region, stdout)

  def is_enabled(self):
    return True

  def execute(self, data, refactoring_name):
    try:
      return node_bridge(data, BIN_PATH, [
        '-r', refactoring_name,
        '-i', self.get_setting('indent') # example: option from configuration file
      ])
    except Exception as e:
      return str(e)

  def get_setting(self, key):
    settings = self.view.settings().get('r-factor')
    if settings is None:
      settings = sublime.load_settings('r-factor.sublime-settings')
    return settings.get(key)


class ConvertToComponentCommand(BaseCommand):
  def __init__(self, arg):
    super(ConvertToComponentCommand, self).__init__(arg)
    self.refactoring_name = 'convert-to-component'


class ConvertToFunctionalComponentCommand(BaseCommand):
  def __init__(self, arg):
    super(ConvertToFunctionalComponentCommand, self).__init__(arg)
    self.refactoring_name = 'convert-to-functional-component'


class GeneratePropTypesCommand(BaseCommand):
  def __init__(self, arg):
    super(GeneratePropTypesCommand, self).__init__(arg)
    self.refactoring_name = 'generate-prop-types'


class MoveDefaultPropsOutOfClass(BaseCommand):
  def __init__(self, arg):
    super(MoveDefaultPropsOutOfClass, self).__init__(arg)
    self.refactoring_name = 'move-default-props-out-of-class'


class MoveDefaultPropsToClass(BaseCommand):
  def __init__(self, arg):
    super(MoveDefaultPropsToClass, self).__init__(arg)
    self.refactoring_name = 'move-default-props-to-class'


class MovePropTypesOutOfClass(BaseCommand):
  def __init__(self, arg):
    super(MovePropTypesOutOfClass, self).__init__(arg)
    self.refactoring_name = 'move-prop-types-out-of-class'


class MovePropTypesToClass(BaseCommand):
  def __init__(self, arg):
    super(MovePropTypesToClass, self).__init__(arg)
    self.refactoring_name = 'move-prop-types-to-class'
