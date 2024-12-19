with open('../src/result.txt', 'r') as file:
    text=file.read()
text=text.strip()
# with open('../src/codeP.py', 'w') as file:
#     file.write(text)
#     file.close()
# print("Success")
import re
def code_to_statements(code):
    
        statements = []
        block_indentation = None
        current_statement = ""

        for line in code.splitlines():
            stripped_line = line.strip()

            if not stripped_line:  # Ignore empty lines
                continue

            # Detect the start of a block (e.g., if, for)
            block_indentation = len(line) - len(line.strip())  # Set block indentation
            if stripped_line.endswith(":") or stripped_line.startswith("else:"):
                if current_statement:
                    statements.append(current_statement.strip())
                    current_statement = ""
                statements.append(stripped_line)
            # Inside a block
            elif block_indentation is not None and (len(line) - len(line.strip())) >block_indentation:
                current_statement += stripped_line + " "

            # End of a block or standalone statement
            else:
                if current_statement:
                    statements.append(current_statement.strip())
                    current_statement = ""
                statements.append(stripped_line)
                statements.append("end")
                block_indentation = None

        # Append any remaining statement
        if current_statement:
            statements.append(current_statement.strip())

        return statements
variables = {}
def validate_and_execute(statement):
    
    errors = []
    def test_operation(v):
        t=False
        op=["+","-","*","/","==","!=","<","<=",">",">=","%"]
        for i in op:
            if i in v:
                t=True
                break
        if not t:
            return v
        v=v[v.index("(")+1:v.index(")")]
        n1,n2=v.split(i)
        n1.strip()
        n2.strip()
        if n1 in variables.keys():
            n1=variables[n1]
        elif n1.isnumeric():
            n1=int(n1)
        else:
            return False
        if n2 in variables.keys():
            n2=variables[n2]
        elif n2.isnumeric():
            n2=int(n2)
        else:
            return False
        
        match i:
            case "+": return n1 + n2
            case "-": return n1 - n2
            case "*": return n1 * n2
            case "/": return n1 / n2
            case "==": return n1 ==n2
            case "!=": return n1!= n2
            case "<": return n1 < n2
            case "<=": return n1 <=n2
            case ">": return n1 > n2
            case ">=": return n1 >=n2
            case "%": return n1 % n2
    def skip_then_block(statements):
        if statements and not statements[0].strip().startswith("else:"):
            statements.pop(0) 

    def skip_else_block(statements):
        if statements and statements[0].strip().startswith("else:"):
            statements.pop(0)  
            if statements:  
                statements.pop(0)
    
    def process_statement(statement):
        try:
            # Variable assignment
            if "=" in statement:
                var_name, value = statement.split("=")
                if not var_name.strip().isalpha():
                    errors.append(f"Invalid variable name: {var_name}")
                else:
                    value=test_operation(value)
                    if value is False:
                        errors.append(f"Invalid variable name")
                    else:
                        if type(value) is int:
                            variables[var_name.strip()] = value
                        else:
                            variables[var_name.strip()] = int(value.strip())

            # Print statement
            elif statement.startswith("print"):
                content = re.match(r'print\((.*)\)', statement).group(1)
                if content.startswith('"') and content.endswith('"'):
                    print(content.strip('"'))
                elif content in variables:
                    print(variables[content])
                elif content.isnumeric():
                    print(content)
                else:
                    errors.append(f"Undefined variable or invalid print content: {content}")

            # If statement
            elif statement.startswith("if"):
                match = re.match(r'if (.+?) then:', statement)
                if match:
                    condition = match.group(1)
                    condition_valid = validate_condition(condition, variables)
                    
                    if condition_valid is True:
                        # Process the instruction after the 'then' part if the condition is true
                        instruction = get_next_instruction(statements)
                        if instruction:
                            process_statement(instruction)
                        else:
                            errors.append("Missing instruction after then:")
                        
                        # Skip the 'else' block since the 'if' condition was true
                        skip_else_block(statements)
                    
                    elif condition_valid is False:
                        # The condition is false, we need to skip the 'then' block
                        skip_then_block(statements)
                        
                        # Now we check for 'else' and process it if found
                        if statements and statements[0].strip().startswith("else:"):
                            statements.pop(0)  # Remove the 'else:' statement
                            instruction = get_next_instruction(statements)
                            if instruction:
                                process_statement(instruction)
                            else:
                                errors.append("Missing instruction after else:")
                        else:
                            pass
                    else:
                        errors.append(condition_valid)
                else:
                    errors.append("Missing instruction after else:")

            # For loop
            elif statement.startswith("for"):
                match = re.match(r'for (\w+) in \((\d+), (\d+)\) do', statement)
                if match:
                    counter, num, step = match.groups()
                    num, step = int(num), int(step)
                    if not counter.isalpha():
                        errors.append(f"Invalid counter variable: {counter}")
                        return
                    execute_for_loop(counter, num, step)
                else:
                    errors.append(f"Invalid for loop syntax: {statement}")

        except Exception as e:
            errors.append(f"Error in statement: {statement} -> {e}")

    def validate_condition(condition, variables):
        condition=condition.strip()
        try:
            for var in variables:
                condition = condition.replace(var, str(variables[var]))
            result = bool(eval(condition))
            if isinstance(result, bool):
                return result
            return f"Invalid condition: {condition}"
        except Exception as e:
            return f"Error in condition: {condition} -> {e}"

    def get_next_instruction(statements):
        try:
            next_statement = statements.pop(0).strip()
            return next_statement if next_statement else None
        except IndexError:
            return None

    def execute_for_loop(counter, num, step):
        counter_value = num
        iterations = 0
        loop_body = extract_loop_body(statements)
        if not loop_body:
            errors.append("Missing loop body for for statement")
            return
        while counter_value < step:
            variables[counter] = counter_value
            for stmt in loop_body:
                process_statement(stmt.strip())
            counter_value += 1
            iterations += 1
            if iterations > step:  # Prevent infinite loops
                errors.append("Infinite loop detected")
                break

    def extract_loop_body(statements):
        loop_body = []
        while statements and not statements[0].strip().startswith("end"):
            loop_body.append(statements.pop(0).strip())
        return loop_body

    # Main processing loop
    while statements:
        statement = statements.pop(0).strip()
        process_statement(statement)

        # Stop execution if any errors are found
        if errors:
            return {"errors": errors}

# Return success only if no errors occurred
    return ""
# Example input
code = '''
A = 6
print("bonjour")
print(A)
if A == 6 then:
    print("A est vrai")
else:
    print(A)
for i in (3, 2) do
    print("A=6")
'''

statements=code_to_statements(text)
result = validate_and_execute(statements)
print(result)