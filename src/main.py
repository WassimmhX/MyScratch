with open('../src/result.txt', 'r') as file:
    text=file.read()
text=text.strip()
import re

def validate_custom_language_code(code):
    errors = []
    declared_variables = set()  # Ensemble des variables déclarées
    lines = code.splitlines()

    # Supprimer les retours à la ligne après "then", "do" et ":"
    code = code.replace('then\n', 'then ')
    code = code.replace('do\n', 'do ')
    code = code.replace('else :\n', 'else :')  # Ignorer le retour à la ligne après "else :"

    # Re-séparer le code en lignes après modification
    lines = code.splitlines()

    for line_num, line in enumerate(lines, start=1):
        line = line.strip()  # Supprimer les espaces et tabulations au début et à la fin de chaque ligne

        # Ignorer les lignes vides
        if not line:
            continue

        # Déclaration de variable sous la forme A = valeur
        match_var = re.match(r'^([A-Z])\s*=\s*(.+)$', line)
        if match_var:
            variable_name = match_var.group(1)
            declared_variables.add(variable_name)
            continue

        # Validation des instructions print
        if line.startswith("print(") and line.endswith(")"):
            content = line[6:-1].strip()  # Extraire le contenu entre les parenthèses
            if content.startswith('"') and content.endswith('"'):
                pass  # Texte valide entre guillemets
            elif re.match(r'^[A-Z]$', content):  # Vérifier que la variable est une lettre majuscule
                if content not in declared_variables:
                    errors.append(f"Ligne {line_num}: La variable {content} n'a pas été déclarée avant utilisation.")
            else:
                errors.append(f"Ligne {line_num}: Syntaxe incorrecte dans print - {line}. Les variables doivent être une lettre majuscule déclarée.")

        # Validation des instructions if avec else
        elif line.startswith("if(") and "then" in line:
            condition_part = line.split("then")[0].strip()[3:-1].strip()  # Extraire la condition
            if not condition_part:
                errors.append(f"Ligne {line_num}: Condition manquante dans if")
            elif line.endswith("then") or line.endswith("then:"):  # Vérifier que then ou then: est correctement formatté
                # Vérifier la présence d'un else
                if "else:" in line:
                    else_part = line.split("else:")[1].strip()
                    if not else_part:
                        errors.append(f"Ligne {line_num}: Après 'else' il faut une instruction.")
                pass
            else:
                errors.append(f"Ligne {line_num}: Syntaxe incorrecte pour if - {line}")

        # Validation des boucles for
        elif line.startswith("for ") and "in (" in line and ") do" in line:
            for_parts = re.match(r"for\s+(\w+)\s+in\s+\((\d+),\s*(\d+)\)\s+do", line)
            if not for_parts:
                errors.append(f"Ligne {line_num}: Syntaxe incorrecte pour for - {line}")
        # Traitement de l'indentation des instructions après "then:" ou "else:"
        if line.endswith("then:") or line.endswith("else:"):
            next_line = lines[line_num] if line_num < len(lines) else ""
            next_line = next_line.lstrip()  # Retirer les tabulations avant l'instruction suivante
            if next_line:
                if not next_line.startswith("print("):
                    errors.append(f"Ligne {line_num + 1}: L'instruction après 'then:' ou 'else:' doit commencer par une instruction valide.")

        
        
    if not errors:
        print("Le code est valide.")
    else:
        print("Erreurs détectées dans le code :")
        for error in errors:
            print(error)


# Exemple de code à valider
custom_code = """
A = 5
print("bonjour")
print(A)
if A == 6 then:
    print("A=6")
if A == 6 then:
    print("A=6")
else:
    print(A)
for i in (1, 2) do
    print("fin de boucle")
"""

validate_custom_language_code(text)