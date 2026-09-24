import ast
from typing import Optional, Tuple

class SinkRegistry:
    """
    Identifies sensitive security sinks across SQL, Command, Code Execution,
    and File I/O operations.
    """

    SQL_METHODS = {'execute', 'executemany', 'raw', 'execute_sql'}
    COMMAND_CALLS = {
        'os.system', 'os.popen', 
        'subprocess.run', 'subprocess.Popen', 'subprocess.call', 'subprocess.check_output'
    }
    CODE_EXEC_CALLS = {'eval', 'exec'}
    FILE_CALLS = {'open'}

    @classmethod
    def get_call_signature(cls, node: ast.Call) -> Tuple[Optional[str], Optional[str]]:
        """
        Extracts the function identifier or method name.
        Returns: (full_qualified_name: Optional[str], method_name: Optional[str])
        """
        if isinstance(node.func, ast.Name):
            return node.func.id, node.func.id
        elif isinstance(node.func, ast.Attribute):
            method = node.func.attr
            if isinstance(node.func.value, ast.Name):
                return f"{node.func.value.id}.{method}", method
            elif isinstance(node.func.value, ast.Attribute):
                # e.g. db.session.execute
                return f"...{node.func.value.attr}.{method}", method
            return None, method
        return None, None

    @classmethod
    def is_sql_sink(cls, node: ast.Call) -> bool:
        full_name, method = cls.get_call_signature(node)
        return method in cls.SQL_METHODS

    @classmethod
    def is_command_sink(cls, node: ast.Call) -> bool:
        full_name, method = cls.get_call_signature(node)
        return full_name in cls.COMMAND_CALLS

    @classmethod
    def is_code_exec_sink(cls, node: ast.Call) -> bool:
        full_name, method = cls.get_call_signature(node)
        return full_name in cls.CODE_EXEC_CALLS

    @classmethod
    def is_file_sink(cls, node: ast.Call) -> bool:
        full_name, method = cls.get_call_signature(node)
        return full_name in cls.FILE_CALLS
