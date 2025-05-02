import os
import shutil

# Define the top-most directory
top_dir = "SGF_Games"

def move_sgf_files_to_top(directory):
    # Walk through all subdirectories and files
    for root, dirs, files in os.walk(directory, topdown=False):
        for file in files:
            if file.endswith(".sgf"):
                # Construct full file paths
                source_path = os.path.join(root, file)
                dest_path = os.path.join(directory, file)
                
                # Move the SGF file to the top-most directory
                if source_path != dest_path:
                    shutil.move(source_path, dest_path)
        
        # Remove empty subdirectories
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            if os.path.isdir(dir_path):
                shutil.rmtree(dir_path)

    # Remove non-SGF files in the top-most directory
    for file in os.listdir(directory):
        file_path = os.path.join(directory, file)
        if os.path.isfile(file_path) and not file.endswith(".sgf"):
            os.remove(file_path)

if __name__ == "__main__":
    if os.path.exists(top_dir) and os.path.isdir(top_dir):
        move_sgf_files_to_top(top_dir)
        print("SGF files moved to the top-most directory and other content removed.")
    else:
        print(f"Directory '{top_dir}' does not exist.")